import partnersMock from './partners.json';

const givePartner = () => {
  const partner = partnersMock[Math.floor(Math.random() * partnersMock.length)];
  return { ...partner };
};

const givePartners = () => [...partnersMock];

export { givePartner, givePartners };
