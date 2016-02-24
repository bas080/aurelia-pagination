import {bindable, inject, computedFrom} from 'aurelia-framework';
import {customElement} from 'aurelia-templating';
import {EntityManager} from 'spoonx/aurelia-orm';

@inject(EntityManager)
@customElement('pagination')
export class Pagination {
  @bindable page;

  @bindable limit = 20;

  @bindable count = 0;

  @bindable resource = null;

  @bindable pagechange = null;

  @computedFrom('count', 'limit')
  get pageCount () {
    return Math.ceil(this.count / this.limit);
  }

  constructor (entityManager) {
    this.entityManager = entityManager;
  }

  attached () {
    if (this.resource) {
      this.repository = this.entityManager.getRepository(this.resource);
    }
    this.updateRecordCount();
  }

  loadPrevious () {
    this.load(this.page - 1);
  }

  loadNext () {
    this.load(this.page + 1);
  }

  load (page) {
    if (page === 0) {
      return;
    }

    page = page || 1;

    if (this.pageCount && page > this.pageCount) {
      return;
    }

    if (typeof this.pagechange === 'function') {
      this.pagechange({page:page})
        .then(result => {
          this.page = page;
        })
        .catch(error => {
          console.error("Something went wrong.", error);
        });
    }
    else {
      this.page = page;
    }

  }

  updateRecordCount () {
    if (this.resource) {
      this.repository.count()
        .then(response => this.count = response.count)
        .catch(response => console.error(response));
    }

  }

}
