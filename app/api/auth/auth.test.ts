/**
 * @jest-environment node
 */

import { INVALID_CREDENTIALS } from "./../errors";
import { LOGIN_REDIRECT_TO, POST as loginPOST } from "./login/route";
import { POST as registerPOST, REGISTER_REDIRECT_TO } from "./register/route";
import { describe, test, expect, beforeAll, afterAll } from "@jest/globals";
import prisma from "@/prisma";
import { createMockRequest } from "@/lib/test-utils";

// iyxan23 - 24 sept:
//     should be better to provide a shim for the database we don't want to be
//     too coupled with the postgres' prisma. The tests took a bit of time to run.
//
//     Might be better to use a sqlite backend for testing instead. But switching
//     databases is a different story for prisma. my god, why does prisma suck

const USERNAME = "nurihsan";
const PASSWORD = "1234567890";
const NONEXISTENT_USERNAME = "duarrrrr";
const WRONG_PASSWORD = "duarrr";

describe("user register and login flow", () => {
  beforeAll(async () => {
    if (await prisma.user.findFirst({ where: { username: USERNAME } })) {
      await prisma.user.delete({ where: { username: USERNAME } });
    }
  });

  test(`create a user named ${USERNAME} with password ${PASSWORD}`, async () => {
    const response = await registerPOST(
      createMockRequest("POST", { username: USERNAME, password: PASSWORD })
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      status: "ok",
      payload: {
        redirect: REGISTER_REDIRECT_TO,
      },
    });

    expect(response.cookies.get("token")).toBeTruthy();
  });

  test(`log on to a user named ${USERNAME} with password ${PASSWORD}`, async () => {
    const response = await loginPOST(
      createMockRequest("POST", { username: USERNAME, password: PASSWORD })
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      status: "ok",
      payload: {
        redirect: LOGIN_REDIRECT_TO,
      },
    });

    expect(response.cookies.get("token")).toBeTruthy();
  });
});

describe("fail on wrong credentials", () => {
  test(`incorrect password login for user ${USERNAME}`, async () => {
    const response = await loginPOST(
      createMockRequest("POST", {
        username: USERNAME,
        password: WRONG_PASSWORD,
      })
    );

    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({
      reason: INVALID_CREDENTIALS,
      status: "err",
    });

    expect(response.cookies.get("token")).toBeFalsy();
  });

  test(`incorrect username login for ${NONEXISTENT_USERNAME}`, async () => {
    const response = await loginPOST(
      createMockRequest("POST", {
        username: NONEXISTENT_USERNAME,
        password: WRONG_PASSWORD,
      })
    );

    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({
      reason: INVALID_CREDENTIALS,
      status: "err",
    });

    expect(response.cookies.get("token")).toBeFalsy();
  });

  test(`invalid login payload`, async () => {
    const response = await loginPOST(
      createMockRequest("POST", {
        random: "payload",
        idk: "bruh",
      })
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toHaveProperty("status", "err");

    expect(response.cookies.get("token")).toBeFalsy();
  });
});
