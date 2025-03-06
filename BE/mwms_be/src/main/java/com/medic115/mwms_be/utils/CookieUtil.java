package com.medic115.mwms_be.utils;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class CookieUtil {

    public static Cookie getCookie(HttpServletRequest request, String name) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equalsIgnoreCase(name)) {
                    return cookie;
                }
            }
        }
        return null;
    }

    public static void createCookies(
            HttpServletResponse response,
            String accessValue,
            String refreshValue,
            long accessExp,
            long refreshExp
    ) {
        Cookie access = new Cookie("access", accessValue);
        access.setHttpOnly(true);
        access.setPath("/");
        access.setMaxAge((int)(accessExp / 1000));
        response.addCookie(access);

        Cookie refresh = new Cookie("refresh", refreshValue);
        refresh.setHttpOnly(true);
        refresh.setPath("/");
        refresh.setMaxAge((int)(refreshExp / 1000));
        response.addCookie(refresh);

        Cookie checkCookie = new Cookie("check", "true");
        checkCookie.setPath("/");
        response.addCookie(checkCookie);
    }

    public static void removeCookies(HttpServletResponse response){
        Cookie access = new Cookie("access", null);
        access.setHttpOnly(true);
        access.setPath("/");
        access.setMaxAge(0);
        response.addCookie(access);

        Cookie refresh = new Cookie("refresh", null);
        refresh.setHttpOnly(true);
        refresh.setPath("/");
        refresh.setMaxAge(0);
        response.addCookie(refresh);
    }
}
