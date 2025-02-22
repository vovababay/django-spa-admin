import React, {useState} from 'react';
import '@/shared/styles/reset.css';
import './App.css';

import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { ModelCreatePage } from '@/pages/ModelCreatePage';
import { AppModelsPage } from '@/pages/AppModelsPage';
import { AdminDashboardPage } from '@/pages/AdminDashboardPage';
import { LoginPage } from '@/pages/LoginPage/ui/LoginPage';
import { hot } from 'react-hot-loader/root';
import {ModelListPage} from "@/pages/ModelListPage";
import {ModelDetailPage} from "@/pages/ModelDetailPage";
import {HistoryPage} from "@/pages/HistoryPage";


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
            element={<AdminDashboardPage/>}
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
                <ModelListPage
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
              <ModelCreatePage
                  activeMenuItem={activeMenuItem}
                  setActiveMenuItem={setActiveMenuItem}
              />
            }
          />
          <Route
            path="/django_spa/admin/:appLabel/:modelName/:pk/change/"
            element={
                <ModelDetailPage
                    activeMenuItem={activeMenuItem}
                    setActiveMenuItem={setActiveMenuItem}
                />
                }
        />
      <Route
          path="/django_spa/admin/:appLabel/:modelName/:pk/history/"
          element={
          <HistoryPage
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

