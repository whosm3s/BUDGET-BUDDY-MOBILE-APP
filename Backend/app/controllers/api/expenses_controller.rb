class Api::ExpensesController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :authorize_request
  
  def index
  
        user_expenses = current_user.expenses
        total_spending = user_expenses.sum(:amount)

  summary = user_expenses
              .where(created_at: Time.current.beginning_of_month..Time.current.end_of_month)
              .group(:category)
              .sum(:amount)

  notes = user_expenses
            .where(created_at: Time.current.beginning_of_month..Time.current.end_of_month)
            .order(created_at: :desc)

  render json: {
    total_spending: total_spending,
    summary: summary,
    notes: notes
  }
  end
  def create
    expense = current_user.expenses.new(expense_params)
    if expense.save
      render json: expense, status: :created
    else
      render json: { errors: expense.errors.full_messages }, status: :unprocessable_entity
    end
end

private

def expense_params
  params.require(:expense).permit(:amount, :category, :note)
end
end
