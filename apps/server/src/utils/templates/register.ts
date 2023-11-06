export const registerEmailTemplate = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Hind:wght@400;700&family=Montserrat:wght@700&family=Outfit:wght@300;500;600;700&family=Roboto:wght@400;700&display=swap"
      rel="stylesheet"
    />
    <title>Cognum - Register</title>
    <style>
      body {
        font-family: Outfit, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }

      .container {
        max-width: 700px;
        margin: 0 auto;
        background-color: #ffffff;
        padding: 20px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }

      .header {
        background-color: #14b8a6;
        color: #fff;
        text-align: center;
        padding: 20px;
      }

      .logo {
        width: 100px;
        height: auto;
      }

      .content {
        padding: 20px;
      }

      .redefine {
        display: flex;
        margin: 16px;
        padding: 8px;
      }

      .btn {
        background-color: #14b8a6;
        color: #fff;
        padding: 10px 20px;
        text-decoration: none;
        display: inline-block;
        border-radius: 5px;
      }

      @media screen and (max-width: 600px) {
        .container {
          width: 100%;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img
          src="https://cognum.ai/wp-content/uploads/2023/07/cognum-logo-300x66.png"
          alt="Logo"
          class="logo"
        />
        <h1>Register</h1>
      </div>
      <div class="content">
        <p>Hello, {{name}}!!</p>
        <p>
        We are excited to welcome you to the Cognum! We are excited to have you on board this exciting journey.
        </p>
        <p>
          If you have not requested your registration, please ignore this email.
        </p>
        <p>Thank you for choosing our services!</p>
        <p>Yours sincerely,<br />Cognum</p>
      </div>
    </div>
  </body>
</html>
`;
