class Expense < ApplicationRecord
  belongs_to :user
  validates :category, inclusion: { in: ["Need", "Want", "Saving"] }
end
