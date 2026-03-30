class Report < ApplicationRecord
  enum :report_type, { pentest: 0, grc: 1, infra: 2, audit: 3 }

  validates :title, :content, presence: true
  validates :accent_color, format: { with: /\A#(?:[0-9a-fA-F]{3}){1,2}\z/ }, allow_blank: true

  scope :recent, -> { order(updated_at: :desc) }

  def to_editor_json
    {
      id:,
      title:,
      report_type:,
      content:,
      accent_color:,
      created_at: created_at.iso8601,
      updated_at: updated_at.iso8601
    }
  end
end
