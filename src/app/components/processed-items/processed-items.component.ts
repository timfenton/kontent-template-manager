import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { List } from 'immutable';
import { map } from 'rxjs/operators';

import { ComponentDependencies } from '../../../di';
import { IProcessingItem } from '../../../services';
import { BaseComponent } from '../../core/base.component';

@Component({
  selector: 'lib-processed-items',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './processed-items.component.html',
})
export class ProcessedItemsComponent extends BaseComponent implements OnInit {

  private _processedItems: List<IProcessingItem> = List<IProcessingItem>([]);

  public get processedItems(): IProcessingItem[] {
    return this._processedItems.toArray();
  }

  constructor(
    dependencies: ComponentDependencies,
    cdr: ChangeDetectorRef) {
    super(dependencies, cdr);
  }

  ngOnInit(): void {
    super.subscribeToObservable(
      this.dependencies.processingService.processedItemsChanged$.pipe(
        map((items) => {
          this._processedItems = this._processedItems.unshift(...items);
          super.detectChanges();
        })
      )
    );

    super.subscribeToObservable(
      this.dependencies.processingService.clearProcessedItemsChanged$.pipe(
        map((item) => {
          this._processedItems = List<IProcessingItem>([]);
          super.detectChanges();
        })
      )
    );
  }
}
