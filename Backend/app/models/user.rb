class User < ApplicationRecord
  has_secure_password
    has_many :budgets
    has_many :incomes
    has_many :expenses
  validates :email, presence: true, uniqueness: true
  validates :password, length: { minimum: 6 }
  validates :name, presence: true

    def generate_auth_token
    token = SecureRandom.hex(32)
    self.auth_token = token
    self.token_expires_at = 1.week.from_now
    save(validate: false)
    token
  end
  
  def clear_auth_token
    self.auth_token = nil
    self.token_expires_at = nil
    save(validate: false)
  end
  
  def self.find_by_auth_token(token)
    return nil unless token.present?
    where(auth_token: token)
      .where("token_expires_at > ?", Time.current)
      .first
  end

end
