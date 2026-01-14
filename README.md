# Email Verification & Messaging Server

This Node.js server provides endpoints for sending email verification codes and receiving messages or menu requests from a website. It uses Express, Nodemailer, and supports CORS and JSON requests.

## Features

- Send a verification code to a user's email
- Verify the code and send a message
- Email sending via configurable SMTP (Nodemailer)
- Static file serving for frontend assets

## Setup

### 1. Install Dependencies

```
npm install express nodemailer cors body-parser
```

### 2. Configure Placeholders

Edit `server.js` and replace all placeholders:

- `<EMAIL_SERVICE>`: e.g., `gmail`
- `<YOUR_EMAIL>`: your business email address
- `<YOUR_APP_PASSWORD>`: your email app password
- `logo.png`: your business logo file (place in the project directory)
- `Your Business Name`: your business name (in the email template)

### 3. Run the Server

```
node server.js
```

The server will start on port 3000 by default.

## API Endpoints

### POST `/send-verification-code`

Send a verification code to the user's email.

- **Body:** `{ "email": "user@example.com" }`
- **Response:** `{ success: true }` or `{ error: "..." }`


## Notes

- For production, use environment variables for sensitive data.
- The verification code is stored in memory (not persistent).
- Make sure your email provider allows SMTP access and app passwords.

## License

MIT
