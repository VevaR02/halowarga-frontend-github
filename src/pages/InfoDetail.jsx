import React from 'react';
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react';

const InfoDetail = ({ info, onBack, userRole, userName, onEdit, onDelete }) => {
    const isAdmin = ['rt', 'rw', 'desa', 'admin'].includes(userRole);

    if (!info) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-400">Info tidak ditemukan</p>
            </div>
        );
    }

    const getCategoryColor = (category) => {
        const colors = {
            'Kesehatan': 'bg-blue-500',
            'Lingkungan': 'bg-green-500',
            'Keamanan': 'bg-red-500',
            'Kegiatan': 'bg-orange-500',
            'Umum': 'bg-yellow-500'
        };
        return colors[category] || 'bg-gray-500';
    };

    return (
        <div className="animate-fade-in pb-10 max-w-4xl mx-auto">
            {/* Back Button */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 group transition-colors"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Kembali ke Daftar Berita</span>
            </button>

            {/* Main Content Card */}
            <article className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                {/* Category Bar */}
                <div className={`h-3 w-full ${getCategoryColor(info.category)}`}></div>

                {/* Header */}
                <div className="p-8 md:p-12 border-b border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <span className={`px-4 py-2 rounded-full text-white text-xs uppercase font-bold tracking-wider ${getCategoryColor(info.category)}`}>
                            <Tag size={12} className="inline mr-1.5" />
                            {info.category}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-6">
                        {info.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-gray-500">
                        <div className="flex items-center gap-2">
                            <Calendar size={18} className="text-yellow-500" />
                            <span className="font-medium">
                                {new Date(info.date).toLocaleDateString('id-ID', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <User size={18} className="text-blue-500" />
                            <span className="font-medium">Oleh: {info.author}</span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 md:p-12">
                    <div className="prose prose-lg max-w-none">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                            {info.content}
                        </p>
                    </div>
                </div>

                {/* Admin Actions */}
                {isAdmin && (
                    <div className="px-8 md:px-12 pb-8 pt-4 border-t border-gray-100 flex gap-4">
                        <button
                            onClick={() => onEdit && onEdit(info)}
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-bold transition-colors"
                        >
                            Edit Berita
                        </button>
                        <button
                            onClick={() => onDelete && onDelete(info.id)}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold transition-colors"
                        >
                            Hapus Berita
                        </button>
                    </div>
                )}
            </article>

            {/* Share / Additional Info */}
            <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-100">
                <p className="text-sm text-yellow-800 font-medium">
                    💡 Informasi ini dipublikasikan oleh pengelola desa untuk kepentingan warga.
                </p>
            </div>
        </div>
    );
};

export default InfoDetail;
