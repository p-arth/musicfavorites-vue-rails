class Song < ApplicationRecord
  belongs_to :artist
  belongs_to :user

  validates :title, :genre, presence: true
end
