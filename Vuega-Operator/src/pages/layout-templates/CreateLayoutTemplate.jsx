import React from 'react';
import useLayoutDesigner from '../../hooks/useLayoutDesigner';
import LayoutConfigPanel from '../../components/layout-designer/LayoutConfigPanel';
import SeatCanvas from '../../components/layout-designer/SeatCanvas';
import SeatPropertiesPanel from '../../components/layout-designer/SeatPropertiesPanel';

/* ──────────────────────────────────────────────
 CreateLayoutTemplate — full-page composer
 Route: /layout-templates/create
 ────────────────────────────────────────────── */

export default function CreateLayoutTemplate() {
 const designer = useLayoutDesigner();

 return (
 <div className="space-y-4">
 {/* Page header */}
 <div>
 <h2 className="text-v-text font-bold tracking-tight">Layout Template Designer</h2>
 <p className="text-v-text-muted mt-0.5">
 Create and customise bus seat-layout templates
 </p>
 </div>

 {/* 3-panel layout */}
 <div className="flex flex-col lg:flex-row gap-4">
 {/* Left — config */}
 <LayoutConfigPanel
 config={designer.config}
 updateConfig={designer.updateConfig}
 isGenerated={designer.isGenerated}
 generateLayout={designer.generateLayout}
 resetLayout={designer.resetLayout}
 undo={designer.undo}
 redo={designer.redo}
 canUndo={designer.canUndo}
 canRedo={designer.canRedo}
 autoRenumber={designer.autoRenumber}
 saveLayout={designer.saveLayout}
 />

 {/* Centre — canvas */}
 <div className="flex-1 bg-v-primary-bg border border-v-border rounded-xl min-h-125 flex flex-col overflow-hidden">
 <SeatCanvas
 lowerDeck={designer.lowerDeck}
 upperDeck={designer.upperDeck}
 isGenerated={designer.isGenerated}
 config={designer.config}
 selectedSeatId={designer.selectedSeatId}
 selectedColumn={designer.selectedColumn}
 selectSeat={designer.selectSeat}
 selectColumn={designer.selectColumn}
 removeSeat={designer.removeSeat}
 restoreSeat={designer.restoreSeat}
 totalSeats={designer.totalSeats}
 />
 </div>

 {/* Right — properties */}
 <SeatPropertiesPanel
 seat={designer.selectedSeat}
 selectedColumn={designer.selectedColumn}
 columnSeats={designer.selectedColumn ? designer.getColumnSeats(designer.selectedColumn.colIndex) : []}
 updateSeatProperty={designer.updateSeatProperty}
 updateColumnType={designer.updateColumnType}
 removeSeat={designer.removeSeat}
 restoreSeat={designer.restoreSeat}
 clearSelection={designer.clearSelection}
 />
 </div>
 </div>
 );
}
