class CreateReports < ActiveRecord::Migration[8.1]
  def change
    create_table :reports do |t|
      t.string :title, null: false, default: "Nouveau rapport"
      t.integer :report_type, null: false, default: 0
      t.json :content, null: false, default: {}
      t.string :accent_color, null: false, default: "#E8A855"

      t.timestamps
    end

    add_index :reports, :report_type
    add_index :reports, :updated_at
  end
end
