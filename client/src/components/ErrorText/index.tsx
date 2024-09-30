import React from 'react';

interface IErrorTextProps {
    error: string;
}

const ErrorText: React.FC<IErrorTextProps> = ({ error }) => {
    if (!error) return null; // Si aucune erreur n'est présente, ne rien rendre

    return (
        <div className="alert alert-danger" role="alert">
            {error}
        </div>
    );
};

export default ErrorText;
