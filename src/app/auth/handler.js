const { User, otpToken } = require("../../models");
const bcrypt = require("bcrypt");
const config = require("../../config/config");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// SERVICES FOR SEND OTP TO USERS
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.otp.gmailServices,
    pass: config.otp.passwordServices,
  },
});

// TODO USER LOGIN
async function postLoginHandler(req, res) {
  const { email, password } = req.body;

  const {
    accessTokenSecret: accessSecret,
    refreshTokenSecret: refreshSecret,
    accessTokenLife: accessExpiresIn,
    refreshTokenLife: refreshExpiresIn,
  } = config.jwt;

  try {
    const response = await User.findOne({
      where: {
        email: email,
      },
    });

    const Match = await bcrypt.compare(password, response.password);
    if (!Match)
      return res
        .status(400)
        .json({ error: true, msg: "Password doesn't match" });

    const payloadUser = {
      user_id: response.user_id,
      fullname: response.fullname,
      username: response.username,
      email: response.email,
      phone: response.phone,
    };

    const accessToken = jwt.sign(payloadUser, accessSecret, {
      expiresIn: accessExpiresIn,
    });

    const refreshToken = jwt.sign(payloadUser, refreshSecret, {
      expiresIn: refreshExpiresIn,
    });

    await User.update(
      { refresh_token: refreshToken },
      {
        where: {
          user_id: response.user_id,
        },
      }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 86400000,
    });

    res.json({
      error: false,
      msg: "Login success",
      loginResult: {
        userId: response.id,
        name: response.fullname,
        token: accessToken,
      },
    });
  } catch (error) {
    res
      .status(400)
      .json({ error: true, msg: `User with email : ${email} not found` });
  }
}

// TODO USER LOGOUT
async function getLogoutHandler(req, res) {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(403).json({ msg: "Please login first" });
  try {
    const singleUser = await User.findOne({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!singleUser) return res.status(403).json({ msg: "User not found" });
    await User.update(
      { refresh_token: null },
      {
        where: {
          user_id: singleUser.user_id,
        },
      }
    );

    res.clearCookie("refreshToken");

    res.status(200).json({ msg: "Logout Success" });
  } catch (error) {
    console.log(error.message);
  }
}

// TODO GENERATE ACCESS TOKEN
async function generateAccessTokenHandler(req, res) {
  try {
    const {
      accessTokenSecret: accessSecret,
      refreshTokenSecret: refreshSecret,
      accessTokenLife: accessExpiresIn,
    } = config.jwt;

    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return res.status(403).json({ msg: "Please login first" });

    const singleUser = await User.findOne({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!singleUser) return res.status(404).json({ msg: "User not found" });

    const payloadUser = {
      user_id: singleUser.user_id,
      fullname: singleUser.fullname,
      username: singleUser.username,
      email: singleUser.email,
      phone: singleUser.phone,
    };

    jwt.verify(refreshToken, refreshSecret, (err, decode) => {
      if (err) return res.sendStatus(403);
      const accessToken = jwt.sign(payloadUser, accessSecret, {
        expiresIn: accessExpiresIn,
      });

      res.json({ accessToken });
    });
  } catch (error) {
    console.log(error.message);
  }
}

// TODO SEND OTP VERIFICATION TO USER
async function sendOTPVerificationEmail({ id, email }, res) {
  try {
    // Generate OTP with 5 digit integer
    const OTP = `${Math.floor(1000 + Math.random() * 90000)}`;

    // Email option
    const mailOptions = {
      from: config.otp.gmailServices,
      to: email,
      subject: "Verify your Email",
      html: `<p>Enter <b>${OTP}</b> to verify your gmail registration </p><p>This code <b>expires in 1 Hours</b></p>`,
    };

    // Hash OTP
    const saltRounds = 10;
    const hashedOTP = await bcrypt.hash(OTP, saltRounds);
    await otpToken.create({
      user_id: id,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });
    await transporter.sendMail(mailOptions);
    res.json({
      error: false,
      msg: "Verification code has been sent please check your email",
      data: {
        userId: id,
        email,
      },
    });
  } catch (error) {
    res.json({
      status: "FAILED",
      msg: error.message,
    });
  }
}

// TODO VERIFY OTP VERIFICATION
async function verifyOTP(req, res) {
  try {
    const { user_id, otp } = req.body;
    if (!user_id || !otp) {
      throw Error("Empty otp is now allowed");
    } else {
      const checkUserRecord = await otpToken.findOne({
        where: {
          user_id: user_id,
        },
      });
      // IF ANY RECORD
      if (checkUserRecord && checkUserRecord.length > 0) {
        throw new Error("user doesn't exist or has been verified");
      } else {
        // USER OTP EXIST
        const expiresAt = checkUserRecord.expiresAt;
        const hashedOTP = checkUserRecord.otp;
        if (expiresAt < Date.now()) {
          // THE OTP EXPIRED
          await otpToken.destroy({
            where: {
              user_id: user_id,
            },
          });
          throw new Error("The code has expired, please request again");
        } else {
          // OTP NOT EXPIRED
          const validOTP = await bcrypt.compare(otp, hashedOTP);
          if (!validOTP) {
            // SUPPLIED OTP IS WRONG
            throw new Error("Invalid code, please check your inbox");
          } else {
            // SUPPLIED OTP IS CORRECT
            await User.update(
              { verified: true },
              {
                where: {
                  user_id: user_id,
                },
              }
            );
            await otpToken.destroy({
              where: {
                user_id: user_id,
              },
            });
            res.json({
              status: "VERIFIED",
              msg: "User email has been verified",
            });
          }
        }
      }
    }
  } catch (error) {
    res.json({
      status: "FAILED",
      msg: error.message,
    });
  }
}

// TODO RESEND OTP VERIFICATION TO USER
async function resendOTPVerificationEmail(req, res) {
  try {
    const { user_id, email } = req.body;
    if (!user_id || !email) {
      throw Error("Empty user is now allowed");
    } else {
      await otpToken.destroy({
        where: {
          user_id: user_id,
        },
      });
      await sendOTPVerificationEmail({ id: user_id, email }, res);
    }
  } catch (error) {
    res.json({
      status: "FAILED",
      msg: error.message,
    });
  }
}
module.exports = {
  postLoginHandler,
  generateAccessTokenHandler,
  getLogoutHandler,
  sendOTPVerificationEmail,
  verifyOTP,
  resendOTPVerificationEmail,
};
