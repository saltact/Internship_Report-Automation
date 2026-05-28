import React, {useState} from 'react';
import UploadForm from '../components/UploadForm';
import HistoryTable from '../components/HistoryTable';
import './Dashboard.css';

function Dashboard () {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const handleUploadSuccess = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="dashboard-layout">
            <header className="dashboard-header">
                <div className="header-content">
                    <h1>Report Automation System - Finelife</h1>
                    <p>Manage, synchronous and export report</p>
                </div>
            </header>

            <main className="dashboard-main">
                <UploadForm onUploadSuccess={handleUploadSuccess} />

                <HistoryTable refreshTrigger={refreshTrigger} />
            </main>
        </div>
    );
}

export default Dashboard;