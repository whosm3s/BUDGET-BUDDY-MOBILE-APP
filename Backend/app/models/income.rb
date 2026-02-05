class Income < ApplicationRecord
  belongs_to :user
  validates :amount, presence: true, numericality: true
end
