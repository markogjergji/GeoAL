from celery.decorators import task
from celery.utils.log import get_task_logger

from geo.util import loadCoordinates

logger = get_task_logger(__name__)


@task(name="load_coordinates_task",bind=True)
def load_coordinates_task(self):
    logger.info("Loading coordinates")
    self.update_state(state='PENDING')
    coordinates = loadCoordinates()
    self.update_state(state='SUCCESS')
    return coordinates

