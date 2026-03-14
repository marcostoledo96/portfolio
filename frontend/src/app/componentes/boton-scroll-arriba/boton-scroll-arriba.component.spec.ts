// BotonScrollArribaComponent Tests: verifica visibility condicional y emisión
// del evento clicked al hacer clic.

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BotonScrollArribaComponent } from './boton-scroll-arriba.component';
import { By } from '@angular/platform-browser';

describe('BotonScrollArribaComponent', () => {
  let fixture: ComponentFixture<BotonScrollArribaComponent>;
  let component: BotonScrollArribaComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotonScrollArribaComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture   = TestBed.createComponent(BotonScrollArribaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('visible inicia en false', () => {
    expect(component.visible).toBeFalse();
  });

  it('no renderiza el botón cuando visible es false', () => {
    component.visible = false;
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button'));
    expect(btn).toBeNull();
  });

  it('renderiza el botón cuando visible es true', () => {
    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button'));
    expect(btn).not.toBeNull();
  });

  it('emite el evento clicked al hacer clic en el botón', () => {
    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();

    const clickedSpy = jasmine.createSpy('clicked');
    component.clicked.subscribe(clickedSpy);

    const btn = fixture.debugElement.query(By.css('button'));
    btn.nativeElement.click();

    expect(clickedSpy).toHaveBeenCalledTimes(1);
  });
});
