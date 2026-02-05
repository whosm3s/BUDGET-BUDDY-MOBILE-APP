user = User.first || User.create(email: "test@example.com", password: "password", username: "Tsii")

Expense.create([
  { amount: 1200, note: "Groceries", category: "Need", date: Date.today, user: user },
  { amount: 400, note: "Movie Night", category: "Want", date: Date.today, user: user }
])
