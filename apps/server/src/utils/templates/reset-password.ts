export const passwordResetEmailTemplate = `
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
    <title>Password reset</title>
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
          src="https://cognum.web.app/assets/icons/icon.png"
          alt="Logo"
          class="logo"
        />
        <h1>Password reset</h1>
      </div>
      <div class="content">
        <p>Hello, <strong>{{name}}</strong></p>
        <p>
          We have received a request to reset your account password. To continue
          the password reset process, click the button below:
        </p>
        <div class='redefine' style='justify-content: center;align-items: center;'>
          <a href="{{link}}" class="btn" style='color:#fff;'>Redefine password</a>
        </div>
        <p>
          We certify that the link lasts 15 minutes, after the deadline a new reset will have to be requested.
        </p>
        <p>
          If you have not requested a password reset, please ignore this email.
          Your current password will remain the same.
        </p>
        <p>Thank you for choosing our services!</p>
        <p>Yours sincerely,<br />Cognum</p>
      </div>
    </div>
  </body>
</html>
`;
