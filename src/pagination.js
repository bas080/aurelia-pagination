import {bindable, inject, computedFrom} from 'aurelia-framework';
import {customElement} from 'aurelia-templating';
import {EntityManager} from 'spoonx/aurelia-orm';

@inject(EntityManager, Element)
@customElement('pagination')
export class Pagination {
  @bindable page;

  @bindable limit = 20;

  @bindable count = 0;

  @bindable repository;

  @bindable pagechange = null;

  @computedFrom('count', 'limit')
  get pageCount () {
    return Math.ceil(this.count / this.limit);
  }

  constructor (entityManager) {
    this.entityManager = entityManager;
  }

  attached () {
    this.updateRecordCount();
    console.log(this.page, this.limit, typeof this.pageChange);
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
      this.pagechange({page:page});
    }
    this.page = page;

  }

  updateRecordCount () {
    this.entityManager.getRepository(this.repository).count()
      .then(response => this.count = response.count)
      .catch(response => console.error(response));
  }

}
