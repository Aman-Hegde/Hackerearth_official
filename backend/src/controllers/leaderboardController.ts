import { Request, Response } from "express";
import {
  getAvailableWeeklyContestWeeks,
  getOverallLeaderboard,
  getWeeklyLeaderboard,
  parseLeaderboardPagination,
} from "../services/leaderboardService";

export const getOverallLeaderboardHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const pagination = parseLeaderboardPagination(req.query);
    const result = await getOverallLeaderboard(pagination);

    return res.status(200).json({
      success: true,
      leaderboard: result.leaderboard,
      pagination: result.pagination,
    });
  } catch (_error) {
    return res.status(500).json({
      success: false,
      message: "Unexpected server error.",
    });
  }
};

export const getWeeklyLeaderboardHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const week = Number(req.query.week);

    if (!Number.isInteger(week) || week < 1) {
      return res.status(400).json({
        success: false,
        code: "INVALID_WEEK",
        message: "A valid week number is required.",
      });
    }

    const pagination = parseLeaderboardPagination(req.query);
    const result = await getWeeklyLeaderboard({
      ...pagination,
      week,
    });

    return res.status(200).json({
      success: true,
      week,
      leaderboard: result.leaderboard,
      pagination: result.pagination,
    });
  } catch (_error) {
    return res.status(500).json({
      success: false,
      message: "Unexpected server error.",
    });
  }
};

export const getWeeklyContestWeeksHandler = async (
  _req: Request,
  res: Response
) => {
  try {
    const weeks = await getAvailableWeeklyContestWeeks();

    return res.status(200).json({
      success: true,
      weeks,
    });
  } catch (_error) {
    return res.status(500).json({
      success: false,
      message: "Unexpected server error.",
    });
  }
};
