import { assert } from "chai";
import sinon from "sinon";
import { getFinalResult } from "../src/controllers/resultController.js";

import FinalResult from "../src/models/resultDetail.js";
import getActiveCycle from "../src/utils/review/getActiveCycle.js";
import Course from "../src/models/courseModel.js";

describe("getFinalResult", function () {
  afterEach(function () {
    sinon.restore();
  });

  it("should return final result with weights for academic role", async function () {
    const req = { user: { _id: "662bfa22149fe3ae70d4331b", role: "head" } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    const next = sinon.stub();
    const testCycle = { _id: "66221bc933be47f7293a7e85" };
    const testResult = {
      status: "completed",
      byPeer: { total: 5 },
      byDean: 3,
      byHead: 4,
      byStudent: { total: 6 },
      byStdRank: 2,
      byPeerRank: 1,
      byDeanRank: 3,
      byHeadRank: 2,
    };
    sinon.stub(getActiveCycle.prototype, "getActiveCycle").resolves("");
    sinon.stub(FinalResult, "findOne").resolves(testResult);
    sinon.stub(FinalResult.prototype, "calculateRanks").resolves();
    sinon.stub(Course, "find").resolves([
      [
        {
          _id: "662bfa22149fe3ae70d4331b",
          name: "Introduction to Programming",
          code: "CS101",
          semester: 2,
          batch: 2019,
          department: "660959dc4482a6bd00331685",
          section: 1,
          startDate: "1970-01-01T00:00:45.412Z",
          endDate: "2024-05-08T00:00:00.000Z",
          instructor: {
            _id: "66164c3f242ab909809173d3",
            firstName: "Hirut",
            lastName: "Jenbere",
            salutation: "Mrs.",
            dateOfJoining: "2024-04-18T00:00:00.000Z",
            experience: 2,
            designation: "plant",
            branch: "Main",
            email: "hirut@gmail.com",
            gender: "Female",
            phone: 995562404,
            age: 21,
            companyEmail: "wku@gmail.com",
            department: "660959dc4482a6bd00331685",
            college: "66093fb4dc86fc4380d73abe",
            __v: 0,
            role: "instructor",
          },
        },
      ],
    ]);

    await getFinalResult(req, res, next);
    sinon.assert.calledWith(res.status, 200);
    sinon.assert.calledWith(res.json, {
      status: "success",
      data: {
        status: "completed",
        weights: [
          { name: "Student", score: 6, rank: 2 },
          { name: "Peer", score: 5, rank: 1 },
          { name: "Director", score: 12, rank: 3 },
          { total: 23 },
        ],
      },
    });
  });

  it("should return final result with weights for non-academic role", async function () {
    const req = {
      user: { _id: "66164c3f242ab909809173d4", role: "teamLeader" },
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    const next = sinon.stub();
    const testCycle = { _id: "65df80fc735c257a6fd0bd34" };
    const testResult = {
      status: "completed",
      byPeer: { total: 5 },
      byDirector: 3,
      byTeamLeader: 4,
      bySelf: 6,
      byPeerRank: 1,
      byDirectorRank: 3,
      byTeamLeaderRank: 2,
      bySelfRank: 4,
    };
    sinon.stub(getActiveCycle.prototype, "getActiveCycle").resolves(testCycle);
    sinon.stub(FinalResult, "findOne").resolves(testResult);
    sinon.stub(FinalResult.prototype, "calculateRanks").resolves();
    sinon.stub(Course, "find").resolves([]);

    await getFinalResult(req, res, next);

    sinon.assert.calledWith(res.status, 200);
    sinon.assert.calledWith(res.json, {
      status: "success",
      data: {
        status: "completed",
        weights: [
          { name: "self", score: 6, rank: 4 },
          { name: "Peer", score: 5, rank: 1 },
          { name: "Director", score: 9, rank: 3 },
          { total: 42.857142857142854 },
        ],
      },
    });
  });
});
