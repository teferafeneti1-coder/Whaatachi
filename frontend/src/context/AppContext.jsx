import { createContext, useContext, useState } from 'react';

// Generate or retrieve a stable anonymous payer ID
function getPayerId() {
  let id = localStorage.getItem('payerId');
  if (!id) {
    id = `anon_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem('payerId', id);
  }
  return id;
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [selectedGender, setSelectedGender] = useState('female');
  const [payerId] = useState(getPayerId);
  const [unlockedContacts, setUnlockedContacts] = useState(() => {
    const stored = localStorage.getItem('unlockedContacts');
    return stored ? JSON.parse(stored) : [];
  });

  const unlockContact = (userId) => {
    setUnlockedContacts((prev) => {
      const updated = [...new Set([...prev, userId])];
      localStorage.setItem('unlockedContacts', JSON.stringify(updated));
      return updated;
    });
  };

  const isUnlocked = (userId) => unlockedContacts.includes(userId);

  return (
    <AppContext.Provider
      value={{
        selectedGoal,
        setSelectedGoal,
        selectedGender,
        setSelectedGender,
        payerId,
        unlockContact,
        isUnlocked,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
