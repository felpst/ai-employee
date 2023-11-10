from flask import Blueprint, request, jsonify
from .tools import python_tool, sql_tool

tools_blueprint = Blueprint("tools", __name__)


@tools_blueprint.route("/python-tool", methods=["POST"])
def python_tool_route():
    try:
        input_data = request.get_json()
        input_text = input_data.get("input_text", "")
        result = python_tool.PythonTool().run(input_text)
        return jsonify({"result": result}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@tools_blueprint.route("/sql-tool", methods=["POST"])
def sql_tool_route():
    try:
        input_data = request.get_json()
        input_text = input_data.get("input_text", "")
        result = sql_tool.SqlTool().run(input_text)
        return jsonify({"result": result}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
