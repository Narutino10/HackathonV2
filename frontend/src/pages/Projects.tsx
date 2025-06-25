import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Project } from '../types';
import '../utils/auth';

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/projects', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div>
      <h1>Liste des projets</h1>
      <ul>
        {projects.map((proj) => (
          <li key={proj.id}>
            <strong>{proj.title}</strong> - {proj.description} ({proj.status})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Projects;
