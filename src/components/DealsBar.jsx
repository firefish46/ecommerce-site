    const DealsBar = ({ deals }) => {
  return (
    <div style={dealsContainer}>
      {deals.map(deal => (
        <div key={deal._id} style={dealCard}>
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: 0, color: '#e74c3c' }}>FLASH DEAL</h4>
            <h3 style={{ margin: '5px 0' }}>{deal.title}</h3>
            <p style={{ fontSize: '12px', color: '#666' }}>{deal.subtitle}</p>
          </div>
          <img src={deal.image} alt="deal" style={{ width: '80px', borderRadius: '5px' }} />
        </div>
      ))}
    </div>
  );
};

const dealsContainer = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', margin: '20px 0' };
const dealCard = { display: 'flex', alignItems: 'center', padding: '20px', backgroundColor: '#fffbe6', border: '1px solid #ffe58f', borderRadius: '8px' };
export default DealsBar;