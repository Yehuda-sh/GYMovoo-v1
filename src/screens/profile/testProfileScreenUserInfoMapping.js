const assert = require('assert');

function mockFormatQuestionnaireValue(key, value) {
  return value === undefined || value === null || value === '' ? 'לא צוין' : value;
}

function getNested(obj, key) {
  if (!obj) return undefined;
  if (key === 'goal') return obj.goal || obj.goals?.[0];
  if (key === 'diet_type' || key === 'diet') return obj.diet_type || obj.diet || obj.nutrition?.[0];
  if (key === 'experience') return obj.experience || obj.fitness_level || obj.fitnessLevel;
  if (key === 'gender') return obj.gender || obj.preferences?.gender;
  if (key === 'availability') return obj.availability;
  return obj[key];
}
function fallback(key, ...sources) {
  for (const src of sources) {
    const val = getNested(src, key);
    if (val !== undefined && val !== null && val !== '') {
      return val;
    }
  }
  return undefined;
}
function getOrDefault(key, ...sources) {
  const val = fallback(key, ...sources);
  return val !== undefined ? val : 'לא צוין';
}
function getUserInfo(user, formatQuestionnaireValue) {
  const questionnaire = (user?.questionnaire || {});
  const smartData = user?.smartQuestionnaireData?.answers || {};
  return {
    age: formatQuestionnaireValue('age', getOrDefault('age', questionnaire, smartData, user)),
    goal: formatQuestionnaireValue('goal', getOrDefault('goal', questionnaire, smartData, user)),
    experience: formatQuestionnaireValue('experience', getOrDefault('experience', questionnaire, smartData, user)),
    frequency: formatQuestionnaireValue('frequency', getOrDefault('frequency', questionnaire, smartData, user)),
    duration: formatQuestionnaireValue('duration', getOrDefault('duration', questionnaire, smartData, user)),
    location: formatQuestionnaireValue('location', getOrDefault('location', questionnaire, smartData, user)),
    gender: formatQuestionnaireValue('gender', getOrDefault('gender', questionnaire, smartData, user?.preferences)),
    height: getOrDefault('height', questionnaire, smartData, user) !== 'לא צוין' ? `${getOrDefault('height', questionnaire, smartData, user)} ס"מ` : 'לא צוין',
    weight: getOrDefault('weight', questionnaire, smartData, user) !== 'לא צוין' ? `${getOrDefault('weight', questionnaire, smartData, user)} ק"ג` : 'לא צוין',
    diet: formatQuestionnaireValue('diet', getOrDefault('diet_type', questionnaire, smartData, user)),
    activity_level: formatQuestionnaireValue('activity_level', getOrDefault('activity_level', questionnaire, smartData, user)),
    workout_time: formatQuestionnaireValue('workout_time', getOrDefault('workout_time', questionnaire, smartData, user)),
    motivation: formatQuestionnaireValue('motivation', getOrDefault('motivation', questionnaire, smartData, user)),
    body_type: formatQuestionnaireValue('body_type', getOrDefault('body_type', questionnaire, smartData, user)),
    sleep_hours: formatQuestionnaireValue('sleep_hours', getOrDefault('sleep_hours', questionnaire, smartData, user)),
    stress_level: formatQuestionnaireValue('stress_level', getOrDefault('stress_level', questionnaire, smartData, user)),
    session_duration: formatQuestionnaireValue('session_duration', getOrDefault('session_duration', questionnaire, smartData, user)),
    health_conditions: (() => {
      const val = getOrDefault('health_conditions', questionnaire, smartData, user);
      if (val === 'לא צוין') return val;
      if (Array.isArray(val)) {
        return val.map((condition) => formatQuestionnaireValue('health_conditions', condition)).join(', ');
      }
      return formatQuestionnaireValue('health_conditions', val);
    })(),
    availability: (() => {
      const val = getOrDefault('availability', questionnaire, smartData, user);
      if (val === 'לא צוין') return val;
      if (Array.isArray(val)) {
        return val.map((day) => formatQuestionnaireValue('availability', day)).join(', ');
      }
      return formatQuestionnaireValue('availability', val);
    })(),
  };
}

// Test cases
const userCases = [
  // Case 1: All fields present in questionnaire
  {
    user: {
      questionnaire: {
        age: 30,
        goal: 'Lose Weight',
        experience: 'Intermediate',
        frequency: '3x/week',
        duration: '45min',
        location: 'Gym',
        gender: 'male',
        height: 180,
        weight: 80,
        diet_type: 'vegan',
        activity_level: 'high',
        workout_time: 'morning',
        motivation: 'health',
        body_type: 'ectomorph',
        sleep_hours: 7,
        stress_level: 'low',
        session_duration: '45min',
        health_conditions: ['none'],
        availability: ['Mon', 'Wed', 'Fri'],
      },
    },
    expected: {
      age: 30,
      goal: 'Lose Weight',
      experience: 'Intermediate',
      frequency: '3x/week',
      duration: '45min',
      location: 'Gym',
      gender: 'male',
      height: '180 ס"מ',
      weight: '80 ק"ג',
      diet: 'vegan',
      activity_level: 'high',
      workout_time: 'morning',
      motivation: 'health',
      body_type: 'ectomorph',
      sleep_hours: 7,
      stress_level: 'low',
      session_duration: '45min',
      health_conditions: 'none',
      availability: 'Mon, Wed, Fri',
    },
  },
  // Case 2: Some fields missing, fallback to smartQuestionnaireData
  {
    user: {
      questionnaire: {
        age: 25,
        goal: '',
      },
      smartQuestionnaireData: {
        answers: {
          goals: ['Build Muscle'],
          fitnessLevel: 'Beginner',
          nutrition: ['vegetarian'],
          gender: 'female',
          availability: ['Tue', 'Thu'],
        },
      },
    },
    expected: {
      age: 25,
      goal: 'Build Muscle',
      experience: 'Beginner',
      frequency: 'לא צוין',
      duration: 'לא צוין',
      location: 'לא צוין',
      gender: 'female',
      height: 'לא צוין',
      weight: 'לא צוין',
      diet: 'vegetarian',
      activity_level: 'לא צוין',
      workout_time: 'לא צוין',
      motivation: 'לא צוין',
      body_type: 'לא צוין',
      sleep_hours: 'לא צוין',
      stress_level: 'לא צוין',
      session_duration: 'לא צוין',
      health_conditions: 'לא צוין',
      availability: 'Tue, Thu',
    },
  },
  // Case 3: All fields missing, expect default
  {
    user: {},
    expected: {
      age: 'לא צוין',
      goal: 'לא צוין',
      experience: 'לא צוין',
      frequency: 'לא צוין',
      duration: 'לא צוין',
      location: 'לא צוין',
      gender: 'לא צוין',
      height: 'לא צוין',
      weight: 'לא צוין',
      diet: 'לא צוין',
      activity_level: 'לא צוין',
      workout_time: 'לא צוין',
      motivation: 'לא צוין',
      body_type: 'לא צוין',
      sleep_hours: 'לא צוין',
      stress_level: 'לא צוין',
      session_duration: 'לא צוין',
      health_conditions: 'לא צוין',
      availability: 'לא צוין',
    },
  },
];

userCases.forEach(({ user, expected }, idx) => {
  const result = getUserInfo(user, mockFormatQuestionnaireValue);
  Object.keys(expected).forEach((key) => {
    assert.strictEqual(result[key], expected[key], `Case ${idx + 1}: Field '${key}' mismatch. Got '${result[key]}', expected '${expected[key]}'`);
  });
});

console.log('All ProfileScreen userInfo mapping tests passed.');
