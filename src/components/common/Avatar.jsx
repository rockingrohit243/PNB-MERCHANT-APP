const Avatar = ({ name }) => (
  <div style={{
    width: 32, height: 32, borderRadius: '50%',
    background: '#e8c4a0', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 13, fontWeight: 700, color: '#7a4a1e', flexShrink: 0,
    border: '2px solid #d4a574'
  }}>
    {name?.charAt(0)?.toUpperCase() || 'M'}
  </div>
);

export default Avatar;