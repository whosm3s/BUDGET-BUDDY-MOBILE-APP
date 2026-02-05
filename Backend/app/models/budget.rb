class Budget < ApplicationRecord
  belongs_to :user
   validates :needs_percent, :wants_percent, :savings_percent, presence: true
  validate :total_must_be_100

  private

  def total_must_be_100
    if (needs_percent.to_i + wants_percent.to_i + savings_percent.to_i) != 100
      errors.add(:base, "The total allocation must equal 100%")
    end
  end
end
