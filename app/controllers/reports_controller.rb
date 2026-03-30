class ReportsController < ApplicationController
  before_action :set_report, only: [ :show, :update, :destroy ]

  def index
    report = Report.recent.first || Report.create!(
      title: I18n.t("editor.new_report"),
      report_type: :pentest,
      content: { version: "1.0", meta: {}, blocks: [] },
      accent_color: "#E8A855"
    )
    redirect_to report_path(report)
  end

  def create
    report = Report.create!(
      title: I18n.t("editor.new_report"),
      report_type: :pentest,
      content: { version: "1.0", meta: {}, blocks: [] },
      accent_color: "#E8A855"
    )
    redirect_to report_path(report)
  end

  def show
    render inertia: "Editor", props: { report: @report.to_editor_json }
  end

  def update
    if @report.update(report_params)
      render json: { success: true, report: @report.to_editor_json }
    else
      render json: { success: false, errors: @report.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @report.destroy!
    redirect_to reports_path, inertia: true
  end

  private

  def set_report
    @report = Report.find(params[:id])
  end

  def report_params
    permitted = params.require(:report).permit(:title, :report_type, :accent_color)
    # Content is arbitrary JSON (blocks). Parse safely from raw params.
    raw_content = params.dig(:report, :content)
    permitted[:content] = raw_content.to_unsafe_h if raw_content.respond_to?(:to_unsafe_h)
    permitted[:content] = raw_content if raw_content.is_a?(Hash)
    permitted
  end
end
