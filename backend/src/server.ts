// Server imports
import express, { Request, Response, NextFunction, response } from "express";
import morgan from "morgan";
import errorHandler from "middleware-http-errors";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import { request, Server } from "http";
import jwt, { JwtPayload } from "jsonwebtoken";

// Helper functions
import { deleteToken, generateToken } from "./helper/tokenHelper";

// Route imports
import { signIn } from "./auth/signin";
import { authLogout } from "./auth/logout";
import { getStreakCounter } from "./userInfos/userStreak";
import { syncUserProgress } from "./levels/syncUserProgress";
import { getLeaderboard } from "./leaderboard/getLeaderboard";
import { upsertSprites } from "./helper/spriteHelper";
import {
  getUserById,
  updateUserAvatar,
  updateUserBackground,
} from "./helper/userHelper";
import { AVATARS, BACKGROUNDS } from "./constants/sprites";

// Database client
const prisma = new PrismaClient();

// Set up web app using JSON
const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
const httpServer = new Server(app);

// Use middleware that allows for access from other domains
app.use(
  cors({
    origin: [
      "http://localhost:8080",
      "https://leetcraft.dev",
      "https://www.leetcraft.dev",
    ],
    credentials: true,
  })
);

// Constants
const PORT: number = parseInt(process.env.PORT || "3000");
const isProduction = process.env.NODE_ENV === "production";
const COOKIES_DOMAIN = isProduction ? ".leetcraft.dev" : ".localhost";
const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 5;

///////////////////////// ROUTES /////////////////////////

// HEALTH CHECK ROUTE
app.get("/", async (req: Request, res: Response) => {
  console.log("Health check");
  res.status(200).json({
    message: "Server is up!",
  });
});

// AUTH ROUTES
app.post("/auth/signin", async (req: Request, res: Response): Promise<any> => {
  try {
    const { leetcodeSessionCookie } = req.body;
    if (!leetcodeSessionCookie) {
      return res
        .status(400)
        .json({ error: "LeetCode session cookie required." });
    }
    const { token, user } = await signIn(leetcodeSessionCookie);

    // Assign cookies
    res.cookie("accessToken", (await token).accessToken, {
      httpOnly: isProduction,
      path: "/",
      secure: isProduction,
      domain: COOKIES_DOMAIN,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 1800000,
    });
    res.cookie("refreshToken", (await token).refreshToken, {
      httpOnly: isProduction,
      path: "/",
      secure: isProduction,
      domain: COOKIES_DOMAIN,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7776000000,
    });

    res.header("Access-Control-Allow-Credentials", "true");

    res.status(200).json(user);
  } catch (error: any) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ error: error.message || "An error occurred." });
  }
});

app.get(
  "/auth/me",
  authenticateToken,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const userId = res.locals.userId;
      const user = await getUserById(userId);
      if (!user) {
        res.status(400).json({ error: "User not found." });
        return;
      }
      res.status(200).json({
        id: user.id,
        name: user.name,
        username: user.username,
        totalSolved: user.totalSolved,
        easySolved: user.easySolved,
        mediumSolved: user.mediumSolved,
        hardSolved: user.hardSolved,
        streaks: user.streaks,
        levels: user.levels,
        xp: user.xp,
        activeAvatar: user.activeAvatarName,
        activeBackground: user.activeBackgroundName,
        leetcodeHandle: user.leetcodeHandle,
        avatarUnlocked: user.avatarUnlocked.map((avatar) => avatar.avatarName),
        backgroundUnlocked: user.backgroundUnlocked.map(
          (background) => background.backgroundName
        ),
      });
    } catch (error: any) {
      console.error(error);
      res
        .status(error.status || 500)
        .json({ error: error.message || "An error occurred." });
    }
  }
);

app.post(
  "/auth/logout",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const userId = res.locals.userId;
      const refreshToken = req.cookies.refreshToken;
      await authLogout(refreshToken);

      // Assign cookies
      res.clearCookie("accessToken", {
        domain: COOKIES_DOMAIN,
      });
      res.clearCookie("refreshToken", {
        domain: COOKIES_DOMAIN,
      });

      res.sendStatus(200);
    } catch (error: any) {
      console.error(error);
      res
        .status(error.status || 500)
        .json({ error: error.message || "An error occurred." });
    }
  }
);

app.get("/streak", authenticateToken, async (req: Request, res: Response) => {
  try {
    // get the streak

    const userId = res.locals.userId;
    const streak = await getStreakCounter(userId);

    res.json(streak);
  } catch (error: any) {
    res.json("Error");
  }
});

// LEVELS ROUTE
app.post(
  "/sync-progress",
  authenticateToken,
  async (req: Request, res: Response) => {
    const { userId, leetcodeHandle } = req.body;

    try {
      const result = await syncUserProgress(userId, leetcodeHandle);
      res.status(200).json(result);
    } catch (error: any) {
      console.error("Sync failed:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  }
);

// LEADERBOARD ROUTE
app.get(
  "/leaderboard",
  authenticateToken,
  async (
    req: Request<{}, {}, {}, { page?: string; size?: string }>,
    res: Response
  ) => {
    try {
      const userId = res.locals.userId;
      // Parse query parameters
      const page = req.query.page
        ? Math.max(1, parseInt(req.query.page, 10))
        : DEFAULT_PAGE_NUMBER;
      const size = req.query.size
        ? Math.max(1, parseInt(req.query.size, 10))
        : DEFAULT_PAGE_SIZE;

      // Send leaderboard response
      const leaderboard = await getLeaderboard(userId, page, size);
      res.status(200).json(leaderboard);
    } catch (error: any) {
      console.error(error);
      res
        .status(error.status || 500)
        .json({ error: error.message || "An error occurred." });
    }
  }
);

// SPRITES ROUTE
app.post(
  "/user/avatar",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const { avatar } = req.body;
      if (!avatar) {
        res.status(400).json({ error: "Avatar is required on the body." });
        return;
      }

      if (avatar && !AVATARS.map((avatar) => avatar.name).includes(avatar)) {
        res.status(400).json({ error: "Invalid avatar name." });
        return;
      }

      const userId = res.locals.userId;
      await updateUserAvatar(userId, avatar);

      const updatedUser = await getUserById(userId);
      res.status(200).json(updatedUser);
    } catch (error: any) {
      console.error("Error updating sprites:", error);
      res
        .status(error.status || 500)
        .json({ error: error.message || "An error occurred." });
    }
  }
);

app.post(
  "/user/background",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const { background } = req.body;
      if (!background) {
        res.status(400).json({ error: "Avatar or background are required." });
        return;
      }

      if (
        background &&
        !BACKGROUNDS.map((background) => background.name).includes(background)
      ) {
        res.status(400).json({ error: "Invalid background name." });
        return;
      }

      const userId = res.locals.userId;
      await updateUserBackground(userId, background);

      const updatedUser = await getUserById(userId);
      res.status(200).json(updatedUser);
    } catch (error: any) {
      console.error("Error updating sprites:", error);
      res
        .status(error.status || 500)
        .json({ error: error.message || "An error occurred." });
    }
  }
);

///////////////////////// SERVER /////////////////////////

// Logging errors
app.use(morgan("dev"));

app.use(errorHandler());

// Start server
const server = httpServer.listen(PORT, () => {
  try {
    upsertSprites(); // Upsert all sprites on server startup
    console.log(`⚡️ Server listening on port ${PORT}`);
  } catch (error) {
    console.error("Error upserting sprites:", error);
    process.exit(1); // Stop server if sprites fail to insert
  }
});

// For coverage, handle Ctrl+C
process.on("SIGINT", () => {
  server.close(() => console.log("Shutting down server."));
});

/* ------------------- HELPER FUNCTIONS ------------------- */
async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken && !refreshToken) {
    res.status(401).json({ error: "No token provided." });
    return;
  }

  try {
    const atDecoded = jwt.verify(
      accessToken,
      process.env.ACCESS_JWT_SECRET as string
    ) as JwtPayload;

    if (atDecoded && atDecoded.userId) {
      const user = await prisma.user.findUnique({
        where: { id: atDecoded.userId },
      });

      if (!user) {
        res.status(403).json({ error: "User not found." });
        return;
      }

      if (user && user.remainingLoginAttempts <= 0) {
        res.status(403).json({ error: "User is blocked." });
        return;
      }

      res.locals.userId = atDecoded.userId;
      return next();
    } else {
      // Access token not valid
      res.status(403).json({ error: "Invalid access token." });
    }
  } catch (err) {
    // If access token is expired or invalid, attempt to use refresh token
    if (!refreshToken) {
      res.status(401).json({ error: "No refresh token provided." });
      return;
    }

    try {
      const rtDecoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_JWT_SECRET as string
      ) as JwtPayload;

      if (rtDecoded && rtDecoded.userId) {
        // Generate new token pair
        const newTokens = await generateToken(rtDecoded.userId);

        // Delete the previous refresh token as they are single use only
        await deleteToken(refreshToken);

        // Set new cookies
        res.cookie("accessToken", newTokens.accessToken, {
          httpOnly: isProduction,
          path: "/",
          secure: isProduction,
          domain: COOKIES_DOMAIN,
          sameSite: isProduction ? "none" : "lax",
          maxAge: 1800000,
        });
        res.cookie("refreshToken", newTokens.refreshToken, {
          httpOnly: isProduction,
          path: "/",
          secure: isProduction,
          domain: COOKIES_DOMAIN,
          sameSite: isProduction ? "none" : "lax",
          maxAge: 7776000000,
        });

        res.locals.userId = rtDecoded.userId;
        return next();
      }
    } catch (refreshErr) {
      // Refresh token is invalid or expired
      res
        .status(403)
        .json({ error: "Invalid refresh token. Please log in again." });
      return;
    }

    // For any other errors
    res.status(500).json({
      error: "An unexpected error occurred when authenticating token.",
    });
  }
}
