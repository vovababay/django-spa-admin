import React from 'react';
import PropTypes from 'prop-types';
import './ModelsTable.css';

export const ModelsTable = ({ modelsByApp, loading }) => {
    if (loading) return <div>Loading...</div>;

    return (
        <div className="models-table">
            {/* Отрендерить таблицу данных */}
            {Object.keys(modelsByApp).map((appName) => (
                <div key={appName}>
                    <h3>{appName}</h3>
                    {/* Здесь можно отобразить список моделей */}
                    <ul>
                        {modelsByApp[appName].map((model) => (
                            <li key={model.id}>{model.name}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

ModelsTable.propTypes = {
    modelsByApp: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
};
