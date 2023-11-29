from flask import Blueprint, request, jsonify
from tools import python_tool, sql_tool
import logging

tools_blueprint = Blueprint("tools", __name__)
logger = logging.getLogger(__name__)

@tools_blueprint.route("/python", methods=["POST"])
def python_tool_route():
    try:
        input_data = request.get_json()
        input_text = input_data.get("input_text", "")
        logger.info(f"Input text: {input_text}")
        result = python_tool.PythonTool().run(input_text)
        logger.info(f"Result: {result}")
        return jsonify({"result": result}), 200
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500


@tools_blueprint.route("/sql-connector", methods=["POST"])
def sql_tool_route():
    try:
        input_data = request.get_json()

        if not isinstance(input_data, dict):
            return jsonify({"error": "Invalid payload"}), 400

        database = input_data.get("database", "")
        username = input_data.get("username", "")
        password = input_data.get("password", "")
        host = input_data.get("host", "")
        db_port = input_data.get("db_port", "")
        db_name = input_data.get("db_name", "")

        if not all((database, username, password, host, db_port, db_name)):
            return jsonify({"error": "Incomplete Params"}), 400

        sql_tool_instance = sql_tool.SqlTool(
            database, username, password, host, db_port, db_name
        )

        input_text = input_data.get("input_text", "")
        logger.info(f"Input text: {input_text}")
        result = sql_tool_instance.run(input_text)
        logger.info(f"Result: {result}")

        return jsonify({"result": result}), 200

    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500
