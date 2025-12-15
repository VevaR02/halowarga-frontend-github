import axios from 'axios';

const API = axios.create({ baseURL: 'https://halowarga-backend-github.onrender.com/api' });


export const loginUser = async (creds) => (await API.post('/login', creds)).data;
export const getDashboardStats = async (rw = 'All') => {
    const response = await API.get(`/dashboard/stats?rw=${rw}`);
    return response.data;
};

export const getWargaList = async (user) => {
    const params = user ? `?scope_role=${user.role}&scope_rt=${user.rt_scope}&scope_rw=${user.rw_scope}` : '';
    const response = await API.get(`/warga${params}`);
    return response.data.data;
};

export const getHeadsOfFamily = async () => {
    const response = await API.get('/warga/heads');
    return response.data.data;
};

export const getFamilyMembers = async (no_kk) => {
    const response = await API.get(`/warga/family/${no_kk}`);
    return response.data.data;
};

export const createWarga = async (data, user) => {
    const payload = {
        ...data,
        input_rt: data.rt,
        input_rw: data.rw,
        scope_role: user.role,
        scope_rt: user.rt_scope,
        scope_rw: user.rw_scope,
        user_id: user.id
    };
    const response = await API.post('/warga', payload);
    return response.data;
};

export const updateWarga = async (id, data, user) => {
    const payload = {
        ...data,
        scope_role: user.role,
        scope_rt: user.rt_scope,
        scope_rw: user.rw_scope,
        user_id: user.id
    };
    const response = await API.put(`/warga/${id}`, payload);
    return response.data;
};
export const deleteWarga = async (id, user) => {
    const params = `?scope_role=${user.role}&scope_rt=${user.rt_scope}&scope_rw=${user.rw_scope}&user_id=${user.id}`;
    const response = await API.delete(`/warga/${id}${params}`);
    return response.data;
};

// Kas functions
export const getAllKas = async (level, rw, rt) => {
    let params = [];
    if (level) params.push(`level=${level}`);
    if (rw) params.push(`rw=${rw}`);
    if (rt) params.push(`rt=${rt}`);
    const queryString = params.length > 0 ? `?${params.join('&')}` : '';
    return (await API.get(`/kas${queryString}`)).data.data;
};

export const getKasChart = async (level, rw, rt) => {
    let params = [];
    if (level) params.push(`level=${level}`);
    if (rw) params.push(`rw=${rw}`);
    if (rt) params.push(`rt=${rt}`);
    const queryString = params.length > 0 ? `?${params.join('&')}` : '';
    return (await API.get(`/kas/chart${queryString}`)).data.data;
};

export const createKas = async (data) => (await API.post('/kas', data)).data;
export const deleteKas = async (id) => (await API.delete(`/kas/${id}`)).data;

export const getRWListFromCitizens = async () => (await API.get('/kas/rw-from-citizens')).data.data;
export const getRTListFromCitizens = async (rw) => (await API.get(`/kas/rt-from-citizens/${rw}`)).data.data;

// Aspirasi functions
export const getAllAspirasi = async () => (await API.get('/aspirasi')).data.data;
export const createAspirasi = async (data) => (await API.post('/aspirasi', data)).data;
export const updateAspirasiStatus = async (id, status, userId) => {
    const response = await API.put(`/aspirasi/${id}`, { status, user_id: userId });
    return response.data;
};
export const deleteAspirasi = async (id, userId) => {
    const response = await API.delete(`/aspirasi/${id}?user_id=${userId}`);
    return response.data;
};

// Info functions
export const getAllInfo = async () => (await API.get('/info')).data.data;
export const getInfoById = async (id) => (await API.get(`/info/${id}`)).data.data;
export const createInfo = async (data) => (await API.post('/info', data)).data;
export const updateInfo = async (id, data) => {
    const response = await API.put(`/info/${id}`, data);
    return response.data;
};
export const deleteInfo = async (id) => (await API.delete(`/info/${id}`)).data;

// User functions
export const getUsers = async () => (await API.get('/users')).data.data;
export const createUser = async (data) => (await API.post('/users', data)).data;
export const updateUser = async (id, data) => (await API.put(`/users/${id}`, data)).data;
export const deleteUser = async (id) => (await API.delete(`/users/${id}`)).data;

export const getAuditLogs = async () => (await API.get('/audit')).data.data;