from django.urls import path
from . import views


urlpatterns = [
    path('',views.index,name="index"),
    path('report',views.report,name="report"),
    path('report_table',views.report_table,name="report_table"),
    path('growth',views.growth,name="growth"),
    path('growth_chart/<str:code>/<str:days>',views.growth_chart,name="growth_chart"),
    path('growth_Holt_Winters',views.growth_Holt_Winters,name="growth_Holt_Winters"),
    path('growth_chart_Holt_Winters/<str:code>/<str:days>',views.growth_chart_Holt_Winters,name="growth_chart_Holt_Winters")
]
