import os, logging
from apscheduler.schedulers.background import BackgroundScheduler
log = logging.getLogger("scheduler")
def _pull_job():
    log.info("Scheduled pull executed (stub). Integrate Freshsales fetch here.")
def maybe_start_scheduler(app):
    if os.getenv("SCHEDULE_DAILY_PULL","true").lower() != "true": return
    hhmm = os.getenv("SCHEDULE_DAILY_AT_HHMM","03:00"); hour, minute = map(int, hhmm.split(":"))
    scheduler = BackgroundScheduler()
    scheduler.add_job(_pull_job, "cron", hour=hour, minute=minute, id="daily_pull")
    scheduler.start()
    app.logger.info("Scheduler started, daily at %02d:%02d", hour, minute)
