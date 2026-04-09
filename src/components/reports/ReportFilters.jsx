import React from 'react';

const ReportFilters = ({
    filterType,
    setFilterType,
    monthlyOption,
    setMonthlyOption,
    customDates,
    setCustomDates,
    onSubmit
}) => {
    return (
        <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #f0f0f0', padding: '24px', marginBottom: 24 }}>
            <p style={{ fontSize: 13, color: '#666', marginBottom: 16 }}>Select a Report Filter</p>

            {/* Radio Group */}
            <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
                {['Today', 'Monthly', 'Custom Range'].map((type) => (
                    <label key={type} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, color: '#111' }}>
                        <input
                            type="radio"
                            name="reportFilter"
                            value={type}
                            checked={filterType === type}
                            onChange={() => setFilterType(type)}
                            style={{ accentColor: '#a32a29', width: 16, height: 16 }}
                        />
                        {type}
                    </label>
                ))}
            </div>

            {/* Conditional Inputs based on Selection */}
            {filterType === 'Monthly' && (
                <div>
                    <p style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>Monthly</p>
                    <div style={{ display: 'flex', gap: 16 }}>
                        <select
                            value={monthlyOption}
                            onChange={(e) => setMonthlyOption(e.target.value)}
                            style={{ padding: '10px 14px', border: '1px solid #ddd', borderRadius: 6, width: 220, fontSize: 13, color: '#111', background: '#fff' }}
                        >
                            <option value="1">Last Month's Report</option>
                            <option value="3">Last 3 Month's Report</option>
                            <option value="6">Last 6 Month's Report</option>
                            <option value="12">Last 12 Month's Report</option>
                        </select>
                        <button onClick={onSubmit} style={{ background: '#a32a29', color: '#fff', border: 'none', borderRadius: 6, padding: '0 24px', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
                            Submit
                        </button>
                    </div>
                </div>
            )}

            {filterType === 'Custom Range' && (
                <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end' }}>
                    <div>
                        <p style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>Start Date</p>
                        <input
                            type="date"
                            value={customDates.start}
                            onChange={(e) => setCustomDates({ ...customDates, start: e.target.value })}
                            style={{ padding: '10px 14px', border: '1px solid #ddd', borderRadius: 6, width: 180, fontSize: 13, color: '#111' }}
                        />
                    </div>
                    <div>
                        <p style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>End Date</p>
                        <input
                            type="date"
                            value={customDates.end}
                            onChange={(e) => setCustomDates({ ...customDates, end: e.target.value })}
                            style={{ padding: '10px 14px', border: '1px solid #ddd', borderRadius: 6, width: 180, fontSize: 13, color: '#111' }}
                        />
                    </div>
                    <button onClick={onSubmit} style={{ background: '#a32a29', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 24px', fontSize: 13, fontWeight: 500, cursor: 'pointer', height: '40px' }}>
                        Submit
                    </button>
                </div>
            )}
        </div>
    );
};

export default ReportFilters;