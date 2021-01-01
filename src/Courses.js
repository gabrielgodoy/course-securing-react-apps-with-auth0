import React, { useEffect, useState } from 'react';

const Courses = ({ auth }) => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch('/courses', {
      headers: {
        Authorization: `Bearer ${auth.getAccessToken()}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Network response is not ok.');
        }
      })
      .then((response) => setCourses(response.courses));

    fetch('/admin', {
      headers: {
        Authorization: `Bearer ${auth.getAccessToken()}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Network response is not ok.');
        }
      })
      .then((response) => console.log(response));
  }, [auth]);

  return (
    <ul>
      {courses.map((course) => (
        <li key={course.id}>{course.title}</li>
      ))}
    </ul>
  );
};

export default Courses;
