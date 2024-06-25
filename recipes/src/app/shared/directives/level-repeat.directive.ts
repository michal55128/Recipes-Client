import { Directive, ElementRef, Input, OnInit, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';

interface LevelInput {
  index: number;
  level: number;
}


@Directive({
  selector: '[appLevelRepeat]',
  standalone: true
})
export class LevelRepeatDirective implements OnInit{

  @Input('appLevelRepeat')
  input!: LevelInput;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    const { index, level } = this.input;
    if (index < level+1) {
      this.renderer.addClass(this.el.nativeElement, 'active');
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'active');
    }
  }

}
