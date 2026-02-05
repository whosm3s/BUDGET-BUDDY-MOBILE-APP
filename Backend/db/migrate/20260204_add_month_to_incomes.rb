class AddMonthToIncomes < ActiveRecord::Migration[8.0]
  def change
    add_column :incomes, :month, :string
  end
end
