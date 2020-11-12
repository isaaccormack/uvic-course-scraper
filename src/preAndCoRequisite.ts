import * as cheerio from 'cheerio';
import courses from '../static/courses/courses.json';
import { Course } from './types.js';

const course = courses as Course[];

export function getPreAndCoReqInfo(c: string) {
  for (let i = 0; i < course.length; i++) {
    if (c == course[i].__catalogCourseId) {
      const preAndCoReqInfo = course[i].preAndCorequisites;
      if (preAndCoReqInfo === undefined) throw new Error('Pre and Co-Requisites are undefined');
      return preAndCoReqInfo;
    }
  }
  throw new Error(`No Course with the name "${c}" found`);
}
const preAndCoReq = {
  all: {
    one: { courses: [''], units: [''] },
    standing: [''],
  },
};
//Specify the course name below to get the information from courses.json
export function getPreAndCoReqData(c: string) {
  const $ = cheerio.load(getPreAndCoReqInfo(c));

  $('[target="_blank"]').each((index, elem) => {
    preAndCoReq.all.one.courses[index] = $(elem)
      .parent()
      .text();
  });
  $('[data-test="ruleView-B-result"]').each((index, elem) => {
    preAndCoReq.all.standing[index] = $(elem)
      .children()
      .first()
      .text();
  });
  $('[data-test="ruleView-A.2-result"]').each((index, elem) => {
    preAndCoReq.all.one.units[index] = $(elem)
      .children()
      .first()
      .text();
  });

  return preAndCoReq;
}
