<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $data = [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
        ];

        if ($request->user()) {
            $data['auth']['notifications'] = $request->user()->notifications()->take(10)->get();

            if ($request->user()->isStaff() || $request->user()->isAdmin()) {
                $data['auth']['teams'] = $request->user()->teams;
            }
        }

        return $data;
    }
}
