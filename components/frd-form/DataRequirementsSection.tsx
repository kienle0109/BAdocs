import { DataEntity } from '@/lib/frd-form-utils';

interface DataSectionProps {
    entities: DataEntity[];
    onChange: (entities: DataEntity[]) => void;
}

export function DataRequirementsSection({ entities, onChange }: DataSectionProps) {
    const addEntity = () => {
        const newEntity: DataEntity = {
            name: '',
            attributes: [],
            relationships: [],
            validationRules: [],
        };
        onChange([...entities, newEntity]);
    };

    const updateEntity = (index: number, updated: DataEntity) => {
        const newEntities = [...entities];
        newEntities[index] = updated;
        onChange(newEntities);
    };

    const removeEntity = (index: number) => {
        onChange(entities.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Data Requirements</h2>
                    <p className="text-gray-400 text-sm">Define data entities, attributes, and validation rules</p>
                </div>
                <button
                    onClick={addEntity}
                    className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-lg font-medium transition-all cursor-pointer flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Entity
                </button>
            </div>

            {entities.length === 0 && (
                <div className="bg-gray-500/10 border border-gray-500/30 rounded-xl p-8 text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                    </svg>
                    <p className="text-gray-400">No data entities defined yet. Click "Add Entity" to get started.</p>
                </div>
            )}

            {entities.map((entity, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 space-y-4">
                    <div className="flex items-center justify-between">
                        <input
                            type="text"
                            value={entity.name}
                            onChange={(e) => updateEntity(index, { ...entity, name: e.target.value })}
                            placeholder="Entity Name (e.g., User, Product)"
                            className="text-xl font-bold bg-transparent border-none text-white placeholder-gray-500 focus:outline-none flex-1"
                        />
                        <button
                            onClick={() => removeEntity(index)}
                            className="p-2 hover:bg-red-600/20 rounded-lg text-red-400 transition-colors cursor-pointer"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Attributes (one per line: name:type:required)</label>
                        <textarea
                            value={entity.attributes.map(attr => `${attr.name}:${attr.type}:${attr.required ? 'required' : 'optional'}`).join('\n')}
                            onChange={(e) => {
                                const lines = e.target.value.split('\n');
                                const attributes = lines.map(line => {
                                    const [name = '', type = 'string', required = 'optional'] = line.split(':');
                                    return { name: name.trim(), type: type.trim(), required: required.trim() === 'required' };
                                }).filter(attr => attr.name);
                                updateEntity(index, { ...entity, attributes });
                            }}
                            placeholder="email:string:required&#10;age:number:optional"
                            rows={3}
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none font-mono text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Relationships (one per line)</label>
                        <textarea
                            value={entity.relationships.join('\n')}
                            onChange={(e) => updateEntity(index, { ...entity, relationships: e.target.value.split('\n').filter(Boolean) })}
                            placeholder="One-to-many with Orders&#10;Many-to-many with Roles"
                            rows={2}
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
