import {
  traverseJSON,
  evaluateRestriction,
  validatePromocode,
} from "../src/promocode/validators/validator.promocode";
import { getOpenWeatherData } from "../src/services/weather/weather.service";

const candidate = {
  date: "2020-01-01",
  age: 50,
  town: "Lyon",
};
const restrictions = [
  {
    date: {
      after: "2019-01-01",
      before: "2020-06-30",
    },
  },
  {
    or: [
      {
        age: {
          eq: 50,
        },
      },
      {
        age: {
          eq: 40,
        },
      },
      {
        and: [
          {
            age: {
              lt: 30,
              gt: 15,
            },
          },
          {
            weather: {
              is: "clear",
              temp: {
                gt: 15,
              },
            },
          },
        ],
      },
    ],
  },
];
const json = {
  or: [
    {
      foo: "bar",
    },
    {
      and: [
        {
          foo: "bar",
        },
        {
          or: [
            { foo: "bar" },
            { and: [{ deepest: "object1" }, { deepest: "object2" }] },
          ],
        },
      ],
    },
  ],
};
let getOpenWeatherDataSpy: any;
beforeEach(() => {
  getOpenWeatherDataSpy = jest
    .spyOn(
      require("../src/services/weather/weather.service"),
      "getOpenWeatherData"
    )
    .mockResolvedValue({
      main: { temp: 20 },
      weather: [{ main: "clear" }],
    });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("Validator promocode", () => {
  test("traverseJSON go through every object of the JSON", () => {
    let deepest: any;
    for (const item of traverseJSON(json)) {
      deepest = item;
    }
    expect(deepest).toEqual({
      context: "and",
      key: "deepest",
      value: "object2",
    });
  });

  test("getOpenWeatherData is mocked", async () => {
    const weatherData = await getOpenWeatherData("Paris");
    expect(weatherData).toEqual({
      main: { temp: 20 },
      weather: [{ main: "clear" }],
    });
    expect(getOpenWeatherDataSpy).toHaveBeenCalledWith("Paris");
  });

  test("evaluateRestriction parse all JSON items", async () => {
    const expected = [
      {
        date: {
          after: "2019-01-01",
          before: "2020-06-30",
        },
        isValid: true,
        context: "",
      },
      { age: { eq: 50 }, isValid: true, context: "or" },
      { age: { eq: 40 }, isValid: false, context: "or" },
      { age: { lt: 30, gt: 15 }, isValid: false, context: "and" },
      {
        weather: { is: "clear", temp: { gt: 15 } },
        isValid: true,
        context: "and",
      },
    ];

    const result = [];
    for (const restriction of restrictions) {
      result.push(...(await evaluateRestriction(candidate, restriction)));
    }

    expect(result).toEqual(expected);
  });

  test("validatePromocode return explanations for falsy values", async () => {
    const expectedErrors = [
      { context: "or", age: { eq: 40 }, isValid: false },
      { context: "and", age: { lt: 30, gt: 15 }, isValid: false },
    ];
    const result = await validatePromocode(candidate, restrictions);
    expect(result.errors).toEqual(expectedErrors);
  });
});
