import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://192.168.137.1:3001";

/* ---------------- TOKEN HELPERS ---------------- */

const storeToken = async (token) => {
  console.log("🔐 Storing token:", token?.substring(0, 20));
  await AsyncStorage.setItem("auth_token", token);
  console.log("✅ Token stored successfully");
};

const getToken = async () => {
  const token = await AsyncStorage.getItem("auth_token");
  console.log("🔑 Retrieved token:", token?.substring(0, 20));
  return token;
};

const clearToken = async () => {
  console.log("🗑️ Clearing token...");
  await AsyncStorage.removeItem("auth_token");
  const cleared = await AsyncStorage.getItem("auth_token");
  if (cleared === null) {
    console.log("✅ Token cleared successfully");
  } else {
    console.error("❌ Failed to clear token!");
  }
};

/* ---------------- SIGN UP ---------------- */

export const signUp = async (userData) => {
  try {
    console.log("🌐 Signup request to:", `${BASE_URL}/api/signup`);
    const response = await fetch(`${BASE_URL}/api/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ user: userData }),
    });

    console.log("📦 Signup response status:", response.status);
    const data = await response.json();
    console.log("📄 Signup response data:", data);

    if (!response.ok) {
      throw new Error(data.errors?.join(", ") || "Signup failed");
    }

    if (data.token) {
      await storeToken(data.token);
    }

    if (data.user) {
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
    }

    return data.user;
  } catch (error) {
    console.error("❌ Signup request error:", error);
    throw error;
  }
};

/* ---------------- SIGN IN ---------------- */

export const signIn = async (email, password) => {
  // Clear old data first
  await clearToken();
  await AsyncStorage.removeItem("user");
  
  console.log("🔐 Attempting login for:", email.trim());
  
  const response = await fetch(`${BASE_URL}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email: email.trim(),
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("❌ Login failed:", data);
    throw new Error(data.error || "Login failed");
  }

  console.log("✅ Login successful");
  console.log("Response data:", data);
  
  if (!data.token) {
    console.error("❌ No token in response!");
    throw new Error("No authentication token received from server");
  }
  
  if (!data.user) {
    console.error("❌ No user in response!");
    throw new Error("No user data received from server");
  }
  
  await storeToken(data.token);
  console.log("✅ Token stored:", data.token.substring(0, 20) + "...");
  
  await AsyncStorage.setItem("user", JSON.stringify(data.user));
  console.log("✅ User stored:", data.user.name, "ID:", data.user.id);

  // Verify token was stored
  const storedToken = await getToken();
  if (storedToken !== data.token) {
    console.error("❌ Token mismatch! Stored:", storedToken, "Expected:", data.token);
  } else {
    console.log("✅ Token verified in storage");
  }

  return data.user;
};

/* ---------------- CURRENT USER ---------------- */

export const getCurrentUser = async () => {
  const token = await getToken();

  if (!token) return null;

  const response = await fetch(`${BASE_URL}/api/current_user`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (response.ok && data.user) {
    await AsyncStorage.setItem("user", JSON.stringify(data.user));
    return data.user;
  }

  return null;
};

/* ---------------- INCOMES ---------------- */

export const getIncomes = async () => {
  const token = await getToken();

  console.log("TOKEN BEING SENT:", token);

  const response = await fetch(`${BASE_URL}/api/incomes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  console.log("INCOME RESPONSE:", data);

  if (!response.ok) {
    throw new Error(data.error || "Unauthorized");
  }

  return data;
};
export const saveIncome = async (incomeData) => {
  const token = await getToken();

  const response = await fetch(`${BASE_URL}/api/incomes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      income: incomeData,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errors?.join(", ") || data.error || "Failed to save income");
  }

  return data;
};

/* ---------------- BUDGETS ---------------- */

export const getBudgets = async () => {
  const token = await getToken();

  const response = await fetch(`${BASE_URL}/api/budgets`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch budgets");
  }

  return data;
};

export const saveBudget = async (budgetData) => {
  const token = await getToken();

  const response = await fetch(`${BASE_URL}/api/budgets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      budget: budgetData,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errors?.join(", ") || data.error || "Failed to save budget");
  }

  return data;
};

/* ---------------- EXPENSES ---------------- */

export const getExpenses = async () => {
  const token = await getToken();

  const response = await fetch(`${BASE_URL}/api/expenses`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch expenses");
  }

  return data;
};

export const saveExpense = async (expenseData) => {
  const token = await getToken();

  const response = await fetch(`${BASE_URL}/api/expenses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      expense: expenseData,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errors?.join(", ") || data.error || "Failed to save expense");
  }

  return data;
};

/* ---------------- LOGOUT ---------------- */

export const logout = async () => {
  const token = await getToken();

  if (token) {
    await fetch(`${BASE_URL}/api/logout`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  await clearToken();
  await AsyncStorage.removeItem("user");

  console.log("👋 Logged out successfully");
};
