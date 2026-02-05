module Api
  class IncomesController < ApplicationController
    skip_before_action :verify_authenticity_token
    before_action :authorize_request   # <-- JWT authorization

    def index
      incomes = current_user.incomes
      render json: {
        incomes: incomes,
        total_income: incomes.sum(:amount)
      }
    end

    def create
      income = current_user.incomes.new(income_params)
      if income.save
        render json: {
          income: income,
          total_income: current_user.incomes.sum(:amount)
        }, status: :created
      else
        render json: { errors: income.errors.full_messages },
               status: :unprocessable_entity
      end
    end

    private

    def income_params
      params.require(:income).permit(:amount, :month)
    end
  end
end
