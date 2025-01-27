import React, {useState} from 'react';
import '@/shared/styles/reset.css';
import './App.css';

import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { DynamicTable } from '@/pages/DynamicTable';
import { ElementPage } from '@/pages/ElementPage';
import { CreateElementPage } from '@/pages/CreateElementPage';
import { AppModelsPage } from '@/pages/AppModelsPage';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage/ui/LoginPage';
import { hot } from 'react-hot-loader/root';


const App = () => {
  const [activeMenuItem, setActiveMenuItem] = useState({"appLabel": null, "modelName": null});

  function RedirectToChange() {
    return <Navigate to={`/django_spa/admin/${appLabel}/${modelName}/${pk}/change/`} replace />;
  }

  return (
    <Router>
      <Routes>
        <Route
            path="/django_spa/admin/"
            element={
                <HomePage/>
                }
        />
        <Route
            path="/django_spa/admin/login/"
            element={
                <LoginPage />
                }

        />
        <Route
            path="/django_spa/admin/:appLabel/:modelName/"
            element={
                <DynamicTable
                    activeMenuItem={activeMenuItem}
                    setActiveMenuItem={setActiveMenuItem}
                />
                }
        />
          <Route
              path="/django_spa/admin/:appLabel/:modelName/:pk/"
              element={<RedirectToChange />}
          />
          <Route
              path="/django_spa/admin/:appLabel/:modelName/add/"
              element={
              <CreateElementPage
                  activeMenuItem={activeMenuItem}
                  setActiveMenuItem={setActiveMenuItem}
              />
            }
          />
          <Route
            path="/django_spa/admin/:appLabel/:modelName/:pk/change/"
            element={
                <ElementPage
                    activeMenuItem={activeMenuItem}
                    setActiveMenuItem={setActiveMenuItem}
                />
                }
        />
        <Route
            path="/django_spa/admin/:appLabel/"
            element={
                <AppModelsPage
                    activeMenuItem={activeMenuItem}
                    setActiveMenuItem={setActiveMenuItem}
                />
                }

        />
      </Routes>
    </Router>
  );
};

export default App;

