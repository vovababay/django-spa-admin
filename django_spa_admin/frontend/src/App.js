import React, {useState} from 'react';
import './reset.css';
import './App.css';

import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { DynamicPage } from './DynamicPage';
import { ElementPage } from './ElementPage';
import { AppModelsPage } from './AppModelsPage';
import { HomePage } from './HomePage';
import { LoginPage } from './pages/LoginPage/LoginPage';

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
                <DynamicPage 
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
