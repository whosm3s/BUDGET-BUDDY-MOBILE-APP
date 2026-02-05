class CreateBudgets < ActiveRecord::Migration[8.0]
  def change
    create_table :budgets do |t|
      t.integer :needs_percent
      t.integer :wants_percent
      t.integer :savings_percent
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
